class RateLimiter {
    constructor(maxRequests, windowSize) {
        this.maxRequests = maxRequests; // Max requests
        this.windowSize = windowSize * 1000; // Convert seconds to milliseconds
        this.requests = new Map(); // Stores user request count & timestamp
    }

    /**
     * @param {string} userId - The unique identifier of the user
     * @return {boolean} - Returns true if the request is allowed, false if rejected
     */
    request(userId) {
        // get current time
        const currentTime = Date.now();

        // check userId in request map. 
        if (!this.requests.has(userId)) {
            // First request for this user
            this.requests.set(userId, { count: 1, timestamp: currentTime });

            // Auto-reset after the window expires
            setTimeout(() => {
                this.requests.delete(userId);
            }, this.windowSize);

            return true;
        }

        // Get stored request info
        let userData = this.requests.get(userId);
        let timeElapsed = currentTime - userData.timestamp;

        // Reset counter if the time window has passed
        if (timeElapsed > this.windowSize) {
            this.requests.set(userId, { count: 1, timestamp: currentTime });

            // Auto-reset again
            setTimeout(() => {
                this.requests.delete(userId);
            }, this.windowSize);

            return true;
        }

        // Check if max requests exceeded
        if (userData.count >= this.maxRequests) {
            return false; // Request rejected
        }

        // Otherwise, increase request count
        userData.count += 1;
        this.requests.set(userId, userData);
        return true;
    }
}

// Example Usage:
const limiter = new RateLimiter(3, 10); // 3 requests per 10 seconds

console.log(limiter.request("user1")); //  user1 Allowed (1st request)
console.log(limiter.request("user1")); //  user1 Allowed (2nd request)
console.log(limiter.request("user1")); //  user1 Allowed (3rd request)
console.log(limiter.request("user1")); //  user1 Rejected (Limit exceeded)
console.log(limiter.request("user2")); //  user2 Allowed (1st request)
console.log(limiter.request("user2")); //  user2 Allowed (2nd request)
console.log(limiter.request("user2")); //  user2 Allowed (3rd request)
console.log(limiter.request("user2")); //  user2 Rejected (Limit exceeded)
console.log(limiter.request("user3")); //  user3 Allowed (1st request)
console.log(limiter.request("user3")); //  user3 Allowed (2nd request)

// After 10 seconds, the counter will auto-reset:
// setTimeout(() => {
//     console.log(limiter.request("user1")); // Allowed (new window)
// }, 10000);
