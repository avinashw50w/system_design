/*Machine Coding Round: FLIPMED

Description:

We are required to build an app that lets patients connect to doctors and book appointments. The day is divided into time slots of 30 mins each, starting from 9 am to 9 pm. Doctors can login to the portal and declare their availability for the given day in terms of slots.  Patients can book appointments/ cancel existing appointments. For simplicity you can assume that the doctors’ availability is declared for that particular day only. 


Features:

A new doctor should be able to register, and mention his/her speciality among (Cardiologist, Dermatologist, Orthopedic, General Physician)
A doctor should be able to declare his/her availability in each slot for the day. For example, the slots will be of 30 mins like 9am-9.30am, 9.30am-10am..
Patients should be able to register. Patients should be able to search available slots based on speciality.  
The slots should be displayed in a ranked fashion. Default ranking strategy should be to rank by start time. But we should be able to plugin more strategies like Doctor’s rating etc in future.
Patients should be able to book appointments with a doctor for an available slot.A patient can book multiple appointments in a day.  A patient cannot book two appointments with two different doctors in the same time slot.
Patients can also cancel an appointment, in which case that slot becomes available for someone else to book.
Build a waitlist feature:
If the patient wishes to book a slot for a particular doctor that is already booked, then add this patient to the waitlist.
If the patient with whom the appointment was booked originally cancels the appointment, then the first in the waitlist gets the appointment.
A patient/doctor should be able to view his/her booked appointments for the day.  

Bonus requirements:

Trending Doctor: Maintain at any point of time which doctor has the most appointments.
Different ranking strategy - use rating of doctor as a strategy to display a list of available doctors for a given specialization.

Expectations and guidelines:
Time: 120mins
You are allowed to access the internet only for syntax purposes.
You are free to use any language of your choice.
Do not use any external libraries. All of the code should be your own.
Implement the code using only in-memory data structures or basic file handling. The use of databases is not allowed.
Do not create any UI for the application.
Write a driver class for demo purpose which will execute all the commands at one place in the code and test cases.
Create the sample data yourself. You can put it into a file, test cases or the main driver program itself.
Make sure that you can execute your code and show that it is working.
Please prioritize code compilation, execution and completion.
Make sure that code is functionally correct.
Work on the expected output first and then add good-to-have features of your own.
Code should be modular and readable.
Separation of concern should be addressed.
Code should easily accommodate new requirements with minimal changes.
Code should be modular and have the correct abstractions.
Code should be legible, readable, and DRY.
Code should be easily testable.
Please focus on the Bonus requirement only after ensuring the required features are complete and demoable. The bonus portion would not be evaluated if any of the required functionality is missing        

Sample Test cases:

The input/output need not be exactly in this format but the functionality should remain intact*/

enum Specialization {
    Cardiologist = "Cardiologist",
    Dermatologist = "Dermatologist",
    Orthopedic = "Orthopedic",
    GeneralPhysician = "GeneralPhysician",
}

class Slot {
    startTime: number;
    endTime: number;

    isBooked: boolean;

    constructor(
        private startTime: number,
        private endTime: number,
        private isBooked: boolean = false,
    ) {}

    getStartTime() {
        return this.startTime;
    }
    getEndTime() {
        return this.endTime;
    }
    bookSlot() {
        this.isBooked = true;
    }
    freeSlot() {
        this.isBooked = false;
    }
}

interface IUser {
    getId();
    getName();
    register();
}

interface IUserWithSpecialization {}

interface IDoctor extends IUser {
    getSpecialization(): Specialization;
    setSpecialization(specialization: Specialization);
    getSlots(): Slot[];
    getSlotsForClient(): Slot[];
    addSlots(slots: Slot[]): void;
    getAppointments(): IAppointment[];
}
interface IPatient extends IUser {
    bookAppointment(doctor: IDoctor, slot: Slot[]): boolean;
    getAppointments(): Appointment[];
    cancelAppointment(appointment: IAppointment): boolean;
}

class Patient implements IPatient {
    constructor(private appointmentService: IAppointmentService) {
        super();
    }

    bookAppointment(doctor: IDoctor, slot: Slot[]) {
        return this.appointmentService.bookAppointment(doctor, this, slot);
    }
    getAppointments() {
        return this.appointmentService.getAppointments(this);
    }
    cancelAppointment(appointment: IAppointment) {
        return this.appointmentService.cancelAppointment(appointment);
    }
}

class Doctor implements IDoctor {
    slots: Slot[];
    _specialization: Specialization;

    constructor(private appointmentService: IAppointmentService) {
        super();
    }

    addSlots(slots: Slot) {
        this.slots.push(...slots);
    }
    getSlots() {
        return this.slots;
    }

    get specialization() {
        return this._specialization;
    }
    set specialization(specialization: Specialization) {
        this._specialization = specialization;
    }

    getSlotsForClient(strategy: ISlotDisplayStrategy) {
        return strategy.getSlots(this);
    }
    getAppointments() {
        return this.appointmentService.getAppointments(this);
    }
}

class Appointment {
    appointmentID: number;
    bookedAt: number;
    constructor(
        private doctor: IDoctor,
        private patient: IPatient,
        private slot: Slot,
    ) {
        this.appointmentID = new UUID();
        this.bookedAt = +new Date();
    }
}

class AppointmentService implements IAppointmentService {
    constructor(private appointmentRepository: IAppointmentRepository) {}

    bookAppointment(doctor: IDoctor, patient: IPatient, slot: Slot) {
        if (this.slot.isBooked()) {
            throw new Error("Slot already booked");
        }
        /*==== put a lock in this block */
        this.slot.bookSlot();
        /*=============================*/

        return this.appointmentRepository.createAppointment(
            doctor,
            patient,
            slot,
        );
    }
    getAppointments(user: IUser) {
        return this.appointmentRepository.getAppointmentsForUser(user);
    }
    cancelAppointment(appointment: IAppointment) {
        return this.appointmentRepository.cancelAppointment(appointment);
    }
}

class AppointmentRepository implements IAppointmentRepository {
    appointments: IAppointment[];

    createAppointment(doctor: IDoctor, patient: IPatient, slot: Slot) {
        const appointment = new Appointment(doctor, patient, slot);
        return appointment;
    }
    getAppointments() {
        return this.appointments;
    }
    getAppointmentsForUser(user: IUser) {
        return this.appointments.filter(
            (appointment) => appointment.user.getId() === user.getId(),
        );
    }
    cancelAppointment(appointment: IAppointment) {
        return this.appointments.splice(this.appointments.indexOf(appointment));
    }
}

interface ISlotDisplayStrategy {
    getSlots(doctor: IDoctor): Slot[];
}

class SlotDisplayByStartTimeStrategy implements ISlotDisplayStrategy {
    getSlots(doctor: IDoctor) {
        const slots = doctor.getSlots();
        slots.sort((a, b) => a.getStartTime() - b.getStartTime());
        return slots;
    }
}

class FlipMed {
    constructor(
        private userService: IUserService,
        private appointmentService: IAppointmentService,
    ) {}

    registerPatient(email: string, hashedPassword: string) {
        return this.userService.registerPatient(email, hashedPassword);
    }
    registerDoctor(
        email: string,
        hashedPassword: string,
        specialization: string,
    ) {
        return this.userService.registerDoctor(
            email,
            hashedPassword,
            specialization,
        );
    }
    getDoctors(filters) {}
    getDoctorSlots(doctor: IDoctor, strategy: ISlotDisplayStrategy) {
        return stategy.getSlots(doctor);
    }
    getAppointments(user: IUser) {
        return this.appointmentService.getAppointments(user);
    }
    bookAppointment(patient: IPatient, doctor: IDoctor, slot: Slot) {
        return this.appointmentService.bookAppointment(doctor, patient, slot);
    }
    cancelAppointment(appointment: IAppointment) {
        return this.appointmentService.cancelAppointment(appointment);
    }
}
