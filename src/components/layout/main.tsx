const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </main>
  );
};

export default Main; 