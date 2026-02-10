"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientsAddRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace("/patients/new"); }, [router]);
    return null;
}
