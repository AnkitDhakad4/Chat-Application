function BorderAnimatedContainer({ children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-px">
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(16,185,129,0.95),rgba(45,212,191,0.85),rgba(16,185,129,0.55))] bg-size-[300%_200%] animate-pulse duration-500" />
      <div className="relative z-10 rounded-2xl bg-slate-950 p-4 ">
        {children}
      </div>
    </div>
  );
}

export default BorderAnimatedContainer;
