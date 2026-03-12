import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";

/**
 * useStomp hook for real-time messaging using STOMP over WebSocket.
 * @param {string} endpoint - WebSocket endpoint URL (e.g., '/ws')
 */
const useStomp = (endpoint = "/ws") => {
    const { token } = useSelector((state) => state.auth);
    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const subscriptions = useRef({});

    const connect = useCallback(() => {
        if (!token || clientRef.current) return;

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
        const wsUrl = apiBaseUrl + endpoint;

        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("STOMP: Connected");
                setConnected(true);
            },
            onStompError: (frame) => {
                console.error("STOMP: Broker error", frame.headers["message"]);
                console.error("STOMP: Details", frame.body);
            },
            onWebSocketClose: () => {
                console.log("STOMP: WebSocket closed");
                setConnected(false);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.activate();
        clientRef.current = client;
    }, [token, endpoint]);

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setConnected(false);
            subscriptions.current = {};
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    const subscribe = useCallback((topic, callback) => {
        if (!clientRef.current || !connected) {
            console.warn(`STOMP: Cannot subscribe to ${topic} (not connected)`);
            return null;
        }

        if (subscriptions.current[topic]) {
            subscriptions.current[topic].unsubscribe();
        }

        const subscription = clientRef.current.subscribe(topic, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error(`STOMP: Error parsing message from ${topic}`, error);
                callback(message.body);
            }
        });

        subscriptions.current[topic] = subscription;
        return subscription;
    }, [connected]);

    const send = useCallback((destination, body) => {
        if (!clientRef.current || !connected) {
            console.warn(`STOMP: Cannot send to ${destination} (not connected)`);
            return;
        }

        clientRef.current.publish({
            destination,
            body: typeof body === "string" ? body : JSON.stringify(body),
            headers: { Authorization: `Bearer ${token}` },
        });
    }, [connected, token]);

    return { connected, subscribe, send };
};

export default useStomp;
