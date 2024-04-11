/*How to handle seat booking in highly concurrent systems such that a seat is not alloted to two different users ?

To handle seat booking in highly concurrent systems, ensuring that a seat is not allocated to two different users, you can implement the following strategies:

1. Locking Mechanism:
- Use a locking mechanism, such as a database table-level lock or an in-memory lock, to ensure that only one user can access and update the seat availability at a time.
- When a user initiates a seat booking, acquire the lock for the specific seat they want to book. This prevents other users from accessing and modifying the seat's availability until the booking is complete.
- After the booking is successful, release the lock so that other users can proceed with their bookings.

2. Optimistic Concurrency Control:
- Instead of using a locking mechanism, you can implement an optimistic concurrency control (OCC) approach.
- In this approach, when a user initiates a seat booking, the system checks the seat's availability without acquiring a lock.
- Once the user submits the booking request, the system checks if the seat's availability has changed since the user initially checked it. If the seat is still available, the booking is confirmed. If the seat is no longer available, the booking is rejected, and the user is notified of the conflict.

3. Queuing and Reservation:
- Implement a queuing system where users can reserve a seat for a specific time frame.
- When a user requests a seat, the system checks if the seat is available during the requested time frame.
- If the seat is available, the system reserves it for the user for a specified duration (e.g., 5 minutes). During this time, the seat is marked as "reserved" and is not available for other users.
- If the user completes the booking within the reservation time, the seat is marked as "booked". - If the reservation time expires without the user completing the booking, the seat is released and becomes available for other users.

4. Distributed Locking:
- In a highly distributed system, you can use a distributed locking mechanism, such as a distributed coordination service (e.g., Apache Zookeeper, etcd, or Consul).
- This allows multiple instances of your application to coordinate and acquire locks for specific seats, ensuring that a seat is not allocated to two different users across multiple application instances.

5. Event Sourcing and Compensation Transactions:
- Implement an event-driven architecture using event sourcing, where all seat booking events are stored in an event log.
- When a user initiates a booking, the system appends a "seat booked" event to the event log. If the booking is later canceled, a "seat released" event is added.
- If a conflict arises (e.g., two users attempt to book the same seat), the system can detect the conflict by analyzing the event log and can execute compensation transactions to resolve the issue.
- The choice of the best approach depends on the specific requirements of your system, such as the level of concurrency, the need for high availability, the complexity of your data model, and the overall architectural design of your application.

In the queuing and reservation method, the key is to reserve the seat for a specific time period and then make it available again if the booking is not completed within that time. Here's how you can implement this approach:

----------------------------------------------------------------
Seat Reservation Mechanism:

To guarantee that no two users are able to reserve the same seat at the same time, you can use a locking mechanism in combination with the reservation process. Here's how you can implement this:

1. Acquire Lock on Seat:
    - When a user tries to reserve a seat, first acquire a lock on the seat before proceeding with the reservation.
    - You can use a distributed locking mechanism, such as the one provided by Zookeeper, to ensure that the lock is acquired across multiple instances of your application.

2. Check Seat Availability:
    - With the lock acquired, check if the seat is available (i.e., not already reserved or booked).

3. Reserve the Seat:
    - If the seat is available, proceed to reserve the seat by updating the seat's status to "reserved" and storing the user's information associated with the reservation.
    - Set the reservation expiration timer as before.

4. Release the Lock:
    - After the seat has been successfully reserved, release the lock on the seat.

5. Handle Reservation Expiration:
    - The process for handling reservation expiration remains the same as in the previous example.
*/

const zookeeper = require("node-zookeeper-client");

class SeatReservationManager {
    constructor(zookeeperConnectString) {
        this.zookeeperClient = zookeeper.createClient(zookeeperConnectString);
        this.reservedSeats = new Map();
        this.expirationTimers = new Map();
        this.RESERVATION_DURATION_MINUTES = 5;
        this.LOCK_PATH = "/locks/seat-";

        this.initZookeeper();
    }

    initZookeeper() {
        this.zookeeperClient.on("connected", () => {
            console.log("Connected to Zookeeper.");
        });

        this.zookeeperClient.on("disconnected", () => {
            console.log("Disconnected from Zookeeper.");
        });

        this.zookeeperClient.connect();
    }

    async reserveSeat(seatId, userId) {
        const lockPath = this.LOCK_PATH + seatId;

        try {
            // Acquire lock on the seat
            await this.createEphemeralNode(lockPath);

            if (!this.reservedSeats.has(seatId)) {
                const expirationTime = new Date(
                    Date.now() + this.RESERVATION_DURATION_MINUTES * 60000,
                );
                const reservation = { seatId, userId, expirationTime };
                this.reservedSeats.set(seatId, reservation);
                this.scheduleReservationExpiration(seatId, expirationTime);

                // Release the lock
                await this.deleteNode(lockPath);
                return true;
            } else {
                // Release the lock
                await this.deleteNode(lockPath);
                return false;
            }
        } catch (err) {
            console.error("Error reserving seat:", err);
            return false;
        }
    }

    confirmBooking(seatId) {
        if (this.reservedSeats.has(seatId)) {
            this.reservedSeats.delete(seatId);
            this.cancelReservationExpiration(seatId);
        }
    }

    cancelReservation(seatId) {
        if (this.reservedSeats.has(seatId)) {
            this.reservedSeats.delete(seatId);
            this.cancelReservationExpiration(seatId);
        }
    }

    scheduleReservationExpiration(seatId, expirationTime) {
        const expirationTimer = setTimeout(() => {
            this.handleReservationExpiration(seatId);
        }, expirationTime.getTime() - Date.now());
        this.expirationTimers.set(seatId, expirationTimer);
    }

    cancelReservationExpiration(seatId) {
        if (this.expirationTimers.has(seatId)) {
            clearTimeout(this.expirationTimers.get(seatId));
            this.expirationTimers.delete(seatId);
        }
    }

    handleReservationExpiration(seatId) {
        if (this.reservedSeats.has(seatId)) {
            this.reservedSeats.delete(seatId);
        }
    }

    async createEphemeralNode(path) {
        return new Promise((resolve, reject) => {
            this.zookeeperClient.create(
                path,
                null,
                zookeeper.ACL.OPEN_ACL_UNSAFE,
                zookeeper.CreateMode.EPHEMERAL,
                (err, path) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(path);
                    }
                },
            );
        });
    }

    async deleteNode(path) {
        return new Promise((resolve, reject) => {
            this.zookeeperClient.remove(path, -1, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

// Usage example
const seatReservationManager = new SeatReservationManager(
    "zookeeper_host:2181",
);

// Reserve a seat
const isSeatReserved = await seatReservationManager.reserveSeat(123, 456);
if (isSeatReserved) {
    console.log("Seat reserved successfully.");
} else {
    console.log("Seat is already reserved.");
}

// Confirm a booking
seatReservationManager.confirmBooking(123);

// Cancel a reservation
seatReservationManager.cancelReservation(123);

/*This implementation uses the node-zookeeper-client library to interact with Zookeeper. The SeatReservationManager class handles the seat reservation process, including acquiring and releasing locks, scheduling and canceling reservation expiration timers, and managing the reserved seats.

The key points are:

The reserveSeat() method first acquires a lock on the seat by creating an ephemeral node in Zookeeper. If the lock is successfully acquired, it proceeds to reserve the seat and schedule the reservation expiration.
The confirmBooking() and cancelReservation() methods update the reservation status and cancel the expiration timer.
The handleReservationExpiration() method is called when the reservation timer expires and removes the reservation if it's still present.
The createEphemeralNode() and deleteNode() methods are helper functions to interact with Zookeeper and create/delete the lock nodes.
Remember to handle any errors that might occur during the locking and reservation process, and consider adding retries and fallback mechanisms to improve the overall reliability of the system.*/
