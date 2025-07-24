"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
