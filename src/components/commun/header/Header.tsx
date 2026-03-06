export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-blue-500">
            <i className="fa-solid fa-bell text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
          </button>
          <button className="bg-blue-500 text-white w-10 h-10 rounded-xl hover:bg-blue-600 transition-all">
            <i className="fa-solid fa-plus"></i>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Welcome</p>
              <p className="text-sm font-bold text-slate-700 leading-none">Dr. Mansouri</p>
            </div>
            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
          </div>
        </div>
      </div>
    </header>
  );
}