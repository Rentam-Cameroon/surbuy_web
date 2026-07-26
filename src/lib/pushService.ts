import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { getTokenFromCookie } from "./auth-utils";

const PUSH_REGISTRATION_URL = "https://izcnepuykfwfrusrooen.supabase.co/functions/v1/push-registration";
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export const pushService = {
    async registerDevice() {
        try {
            const token = getTokenFromCookie();
            if (!token) {
                console.log("Push: User not logged in, skipping registration");
                return;
            }

            const m = await messaging();
            if (!m) {
                console.warn("Push: Messaging not supported or firebase not initialized");
                return;
            }

            // Request permission
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.warn("Push: Notification permission not granted");
                return;
            }

            // Get FCM token
            const fcmToken = await getToken(m, {
                vapidKey: VAPID_KEY,
            });

            if (!fcmToken) {
                console.warn("Push: Failed to get FCM token");
                return;
            }

            // Send to Supabase Edge Function
            const response = await fetch(PUSH_REGISTRATION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    fcm_token: fcmToken,
                    platform: "web",
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to register device");
            }

            console.log("Push: Device registered successfully");
        } catch (error) {
            console.error("Push Error:", error);
        }
    }
};
