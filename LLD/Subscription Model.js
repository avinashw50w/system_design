class SubscriptionPlan {
  constructor(name, price, duration) {
    this.name = name;
    this.price = price;
    this.duration = duration;
  }

  getDescription() {
    return `${this.name} Plan: $${this.price} per ${this.duration} months`;
  }
}

class Subscription {
  constructor() {
    this.subscribers = [];
    this.availablePlans = [
      new SubscriptionPlan('Beginner', 9.99, 1),
      new SubscriptionPlan('Intermediate', 19.99, 3),
      new SubscriptionPlan('Advanced', 29.99, 6),
    ];
  }

  subscribe(user, plan) {
    if (!this.availablePlans.includes(plan)) {
      throw new Error('Invalid subscription plan.');
    }

    const subscription = {
      user,
      plan,
      startDate: new Date(),
    };

    this.subscribers.push(subscription);
    console.log(`User ${user.name} has subscribed to the ${plan.name} plan.`);
  }

  unsubscribe(user) {
    const index = this.subscribers.findIndex(subscription => subscription.user === user);

    if (index !== -1) {
      this.subscribers.splice(index, 1);
      console.log(`User ${user.name} has unsubscribed.`);
    } else {
      console.log('User not found in subscribers list.');
    }
  }

  listSubscriptions() {
    console.log('List of Subscriptions:');
    this.subscribers.forEach(subscription => {
      console.log(`- User: ${subscription.user.name}, Plan: ${subscription.plan.name}, Started on: ${subscription.startDate}`);
    });
  }
}

class User {
  constructor(name) {
    this.name = name;
  }
}

// Example usage:

const subscriptionModel = new Subscription();
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

const beginnerPlan = subscriptionModel.availablePlans[0];
const intermediatePlan = subscriptionModel.availablePlans[1];

subscriptionModel.subscribe(alice, beginnerPlan);
subscriptionModel.subscribe(bob, intermediatePlan);

subscriptionModel.listSubscriptions();

subscriptionModel.unsubscribe(alice);

subscriptionModel.listSubscriptions();
