class TokenBucket {
    constructor(capacity, tokensPerSecond) {
        this.capacity = capacity;
        this.tokensPerSecond = tokensPerSecond;
        this.tokens = capacity;
        this.lastRefillTime = Date.now() / 1000; // Convert milliseconds to seconds
    }

    _refill() {
        const now = Date.now() / 1000; // Convert milliseconds to seconds
        const timePassed = now - this.lastRefillTime;
        const newTokens = timePassed * this.tokensPerSecond;
        this.tokens = Math.min(this.capacity, this.tokens + newTokens);
        this.lastRefillTime = now;
    }

    consume(tokens) {
        if (tokens <= 0) {
            return true; // No need to consume tokens if tokens requested is 0 or less.
        }

        this._refill();
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        } else {
            return false;
        }
    }
}

// Example usage:
const bucket = new TokenBucket(10, 2);

// Try to consume 5 tokens
if (bucket.consume(5)) {
    console.log("Request processed. Remaining tokens:", bucket.tokens);
} else {
    console.log("Request rate limited. Remaining tokens:", bucket.tokens);
}

// Sleep for a while to allow tokens to refill (using setTimeout for simplicity)
setTimeout(() => {
    // Try to consume 7 tokens
    if (bucket.consume(7)) {
        console.log("Request processed. Remaining tokens:", bucket.tokens);
    } else {
        console.log("Request rate limited. Remaining tokens:", bucket.tokens);
    }
}, 2000); // Sleep for 2 seconds
