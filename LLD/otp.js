class OTPService {
	private redis;
	private smsService;

	constructor(redisOptions, smsService) {
		this.redis = new Redis(redisOptions);
		this.smsService = smsService;
	}

	private getKey(user) {
		return `otp:${user.id}`;
	}
	
	genOTP(otpLength = 6) {
		return Math.floor(Math.random() * otpLength);
	}

	send(user, ttl = 60) {
		const otp = this.genOTP();
		const key = this.getKey(user);
		this.redis.setex(key, ttl, otp);
		this.smsService.send('otp', {user, otp, ttl});
	}

	verify(user, otp) {
		const key = this.getKey(user);
		const sentOtp = this.redis.get(key);
		return sentOtp === otp;
	}

	resend(user, ttl = 60) {
		const key = this.getKey(user);
		const hasExpired = !this.redis.get(key);
		if (hasExpired) {
			this.send(user);
		}
	}
}