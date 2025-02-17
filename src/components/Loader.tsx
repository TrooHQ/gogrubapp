const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full w-16 h-16"></div>

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loader {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
