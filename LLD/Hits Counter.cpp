/*Design a system that gives us the no of hits in the system in the last 5 minutes.

IDEA:
We are only concerned about hits in the last 5 minutes(300 seconds).
Approach 1:
we can use a deque to store the timestamp(unix) when there was a hit
- keep removing hits from the front of the deque if the timestamp < current_timestamp - 300
- no of hits will be the size of the deque
- Drawbacks: the deque size can increase significantly if the no of hits are more
		we also need to keep removing the older entries from the front of the deque
		which in worst case can be O(N)

Approach 2:
use a fixed sized array 'time' of size 300 to store the timestamps. How ?
module the timestamp with 300, eg, 524 % 300 = 224, then store 524 in the index 224
and increment the counter at index 224.
In case the index x % 300 is already occupied, then just replace it. Because collision
will only occur when 300 seconds have passed.
*/

// using approach 1
class HitCounter {
	deque<int> q;
	int window_size;
public:
	HitCounter(int time_window) {
		this->window_size = time_window;
	}

	void hit(int timestamp) {
		int window_start = get_current_timestamp() - window_size;
		while (!q.empty() and q.front() < window_start)
			q.pop_front();
		q.push(timestamp);
	}

	int hitCount() {
		return q.size();
	}
}

// using approach 2
class HitCounter {
	vector<int> time;
	vector<int> counter;
	int size;
public:
	HitCounter(int N) {
		this->size = N;
		time = vector<int>(N, -1);
		counter = vector<int>(N, 0);
	}

	void hit(int timestamp) {
		int index = timestamp % N;
		if (time[index] != timestamp) {
			time[index] = timestamp;
			counter[index] = 1;
		}
		else
			counter[index]++;
	}

	int hitCount() {
		int count = 0;
		for (int i = 0; i < counter.size(); ++i) {
			count += counter[i];
		}

		return count;
	}
}

void hits