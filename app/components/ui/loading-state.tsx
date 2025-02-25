// app/components/ui/loading-state.tsx
export default function LoadingState() {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-[#ff7f50] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
