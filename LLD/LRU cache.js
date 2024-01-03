class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Key-value store for quick access
        this.ordering = new DoublyLinkedList(); // Doubly linked list for maintaining usage order
    }

    get(key) {
        if (this.cache.has(key)) {
            // Move the accessed item to the front of the list (most recently used)
            const node = this.cache.get(key);
            this.ordering.moveToFront(node);
            return node.value;
        }
        return -1; // Key not found
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // If key exists, update the value and move the item to the front
            const node = this.cache.get(key);
            node.value = value;
            this.ordering.moveToFront(node);
        } else {
            // If cache is at capacity, remove the least recently used item
            if (this.cache.size >= this.capacity) {
                const removedNode = this.ordering.removeLast();
                this.cache.delete(removedNode.key);
            }

            // Add the new item to the cache and front of the list
            const newNode = new DoublyLinkedListNode(key, value);
            this.cache.set(key, newNode);
            this.ordering.addToFront(newNode);
        }
    }
}

class DoublyLinkedListNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = new DoublyLinkedListNode(null, null);
        this.tail = new DoublyLinkedListNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    addToFront(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    moveToFront(node) {
        this.removeFromList(node);
        this.addToFront(node);
    }

    removeLast() {
        if (this.tail.prev === this.head) return null; // List is empty

        const lastNode = this.tail.prev;
        this.removeFromList(lastNode);
        return lastNode;
    }

    removeFromList(node) {
        const prevNode = node.prev;
        const nextNode = node.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }
}

// Example usage:
const lruCache = new LRUCache(3); // Capacity of 3

lruCache.put(1, 1); // Cache: {1=1}
lruCache.put(2, 2); // Cache: {1=1, 2=2}
lruCache.put(3, 3); // Cache: {1=1, 2=2, 3=3}
console.log(lruCache.get(2)); // Returns 2 (use 2, so it becomes most recently used)
lruCache.put(4, 4); // Cache: {2=2, 3=3, 4=4} (remove 1 as it's the least recently used)
console.log(lruCache.get(1)); // Returns -1 (not found)
