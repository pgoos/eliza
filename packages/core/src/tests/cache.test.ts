/* eslint-disable no-dupe-class-members */
import { CacheManager, MemoryCacheAdapter } from "../cache.ts"; // Adjust the import based on your project structure
import { vi } from "vitest";

describe("CacheManager", () => {
    let cache: CacheManager<MemoryCacheAdapter>;

    beforeEach(() => {
        cache = new CacheManager(new MemoryCacheAdapter());
        vi.useFakeTimers();
        vi.setSystemTime(Date.now());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should set/get/delete cache", async () => {
        await cache.set("foo", "bar");

        expect(await cache.get("foo")).toEqual("bar");

        expect(cache.adapter.data.get("foo")).toEqual(
            JSON.stringify({ value: "bar", expires: 0 })
        );

        await cache.delete("foo");

        expect(await cache.get("foo")).toEqual(undefined);
        expect(cache.adapter.data.get("foo")).toEqual(undefined);
    });

    it("should set/get/delete cache with expiration", async () => {
        const expires = Date.now() + 5 * 1000;

        await cache.set("foo", "bar", { expires: expires });

        expect(await cache.get("foo")).toEqual("bar");

        expect(cache.adapter.data.get("foo")).toEqual(
            JSON.stringify({ value: "bar", expires: expires })
        );

        vi.setSystemTime(expires + 1000);

        expect(await cache.get("foo")).toEqual(undefined);
        expect(cache.adapter.data.get("foo")).toEqual(undefined);
    });
});
