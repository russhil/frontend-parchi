"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppointmentsAddRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace("/schedule/new"); }, [router]);
    return null;
}
