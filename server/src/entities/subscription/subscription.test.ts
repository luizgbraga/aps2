import { describe, expect, it } from '@jest/globals';
import { FakeSubscriptionRepository } from './repository';

describe("subscribe", () => {
    it("should subscribe new neighborhood", async () => {
        const fakeSubscriptions = new FakeSubscriptionRepository([]);
        const newSubscription = { userId: "1234", neighborhoodId: "ndojwq", unread: 0,  createdAt: new Date()}
        await expect(fakeSubscriptions.subscribe(newSubscription.userId, newSubscription.neighborhoodId)).resolves.toEqual([newSubscription]);
    })
})