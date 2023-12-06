---
title: Test Stripe Subscriptions with Test Clocks
publishDate: Thu Jan 05 2023 00:00:00 GMT-0500 (Eastern Standard Time)
excerpt: Testing Stripe Subscription is tricky. Test clocks are like micro-universes that can simulate any advancement in time.
featureImage:
  src: '/assets/blog/test-stripe-subscriptions-with-test-clocks.jpg'
---

<small>This post was originally written for the [Echobind blog](https://echobind.com/blog).</small>


**tl;dr**: Testing Stripe Subscription is tricky. Test clocks are like micro-universes that can simulate any advancement in time. Any customers created in the test clock universe, and any subscriptions attached to those customers, participate in the time travel.

[Stripe Subscriptions](https://stripe.com/billing) provide an easy way to have customers pay on a regular basis. There’s a lot of opportunity for complicating them, though. Subscriptions support trial periods, when the customer isn’t charged for a number of days, or [Subscription Schedules](https://stripe.com/docs/billing/subscriptions/subscription-schedules) which let you change the products or discounts on a subscription.

Testing these features is tough since we can’t control the flow of time, which has a pesky habit of passing at one second per second. Theoretical time travel methods, like [yeeting yourself at the speed of light](https://en.wikipedia.org/wiki/Twin_paradox), likely won’t help in this situation.

Fortunately, Stripe Test Clocks give us a way to control the flow of time for specific subscription objects.

### [Test Clocks](https://stripe.com/docs/billing/testing/test-clocks)

There are a few steps to use test clocks:

1. Go to the Stripe dashboard and turn on test mode.
2. [Create a test clock](https://dashboard.stripe.com/test/test-clocks).
3. Create a customer in that test clock.
4. Create a subscription of that customer.
5. Advance the test clock into the future by a number of days or months.
6. Check the results.

All of this can be done from the Stripe API as well. Just pass a `test_clock` parameter when creating your Stripe customer, and any subscriptions attached to that customer will advance with the test clock.

I recently needed to test a complicated subscription behavior. The app needed the ability to skip a customer’s subscription payment for one month. It did this with subscription schedules — it would apply a one-month free trial to the subscription while pushing the end date back by a month. So a customer with a 6 month subscription that skipped two months of payments would still only pay 6 times, with the payments split across eight months.

![A list of invoices showing the initial payment and then six months of subscription payments with two skips](/assets/blog/subscription-invoice.jpg)

I tested this by first creating a test clock and a customer in that test clock. I took the customer ID and manually inserted it into my apps test database for a new test user.

![Manually updating the test clock customer](/assets/blog/subscription-customer.jpg)

Now anything that I do in the app as that customer, including creating new subscriptions, will be included in the Stripe Test clock. I created a 6 month subscription, which I could see in the Test Clock dashboard.

![How to advance the test clock simulation](/assets/blog/subscription-advance.jpg)

Next, I used the “Skip Payment” feature in my app, which updated the subscription schedule like I described above. I checked the subscription to see the month long trial added and the end date pushed back by a month.

Then to make sure everything sorted out correctly, I advanced my test clock by a few months and checked the subscription again.

When I initially built this feature, I found a bug that added a prorated amount to the subscription because of the mid-subscription trial period. If I hadn’t used test clocks to test this feature, the bug would have persisted to production causing customers to overpay.

After advancing the clock a few times, I checked the end state of the subscription. Once I found all of the payments and skipped months exactly the way I expected, I knew the feature was ready to ship.
