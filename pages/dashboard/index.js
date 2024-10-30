import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";

import ClipboardList from "@/components/clipboard/ClipboardList";
import NewClipboard from "@/components/clipboard/NewClipboard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { PaginationControls } from "@/components/clipboard/PaginationControls";
import useClipboardManager from "@/hooks/useClipboardManager";

const Dashboard = () => {
  const { status, data } = useSession();
  const router = useRouter();
  const {
    clipboards,
    loading,
    copyTheClipboardContent,
    currentPage,
    totalPages,
    fetchClipboards,
    handlePageChange,
    initializePusher,
  } = useClipboardManager(data);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "loading") {
      // Handle loading state
    }

    if (status === "authenticated") {
      initializePusher();
      fetchClipboards(1);
    }
  }, [status, router, initializePusher, fetchClipboards]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header authData={{ status, user: data?.user }} />

        <div className="flex">
          <main className="flex-1 p-2">
            <div className="max-w-4xl mx-auto">
              <NewClipboard />
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <ClipboardList
                    items={clipboards}
                    onCopy={copyTheClipboardContent}
                  />
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
