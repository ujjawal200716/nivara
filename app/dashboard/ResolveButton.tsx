"use client";

import { useState } from "react";

export function ResolveButton({ complaintId }: { complaintId: string | number }) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      // TODO: Call an API or Server Action to update the complaint status in Supabase
      console.log(`Resolving complaint ${complaintId}...`);
      
      // Example of what the API call might look like:
      // await fetch(`/api/complaints/${complaintId}/resolve`, { method: "POST" });
      
    } catch (error) {
      console.error("Failed to resolve complaint:", error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <button
      onClick={handleResolve}
      disabled={isResolving}
      className="btn-outline w-full mt-3 py-1.5 text-xs flex justify-center items-center transition-colors hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
    >
      {isResolving ? "Resolving..." : "Resolve Ticket"}
    </button>
  );
}
