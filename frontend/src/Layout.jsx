import React from "react";
import { useAuth } from "./context/AuthContext";
import { LogOut } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils/index";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Plus, 
  ArrowUpDown, 
  Tags, 
  TrendingUp,
  Wallet,
  PieChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Add Transaction",
    url: createPageUrl("AddTransaction"),
    icon: Plus,
  },
  {
    title: "Transactions",
    url: createPageUrl("Transactions"),
    icon: ArrowUpDown,
  },
  {
    title: "Categories",
    url: createPageUrl("Categories"),
    icon: Tags,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { user, logout } = useAuth(); // Add this line

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">FinWise</h2>
                <p className="text-xs text-slate-500">Personal Finance Manager</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 group ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                            location.pathname === item.url ? 'text-blue-600' : ''
                          }`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-3 px-2">
                  <Link to="/transactions/add" state={{ defaultType: "income" }} className="block">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800 text-sm">Add Income</p>
                          <p className="text-xs text-green-600">Quick entry</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/transactions/add" state={{ defaultType: "expense" }} className="block">
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-800 text-sm">Add Expense</p>
                          <p className="text-xs text-red-600">Track spending</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* // In the SidebarFooter section, replace the existing footer with: */}
            <SidebarFooter className="border-t border-slate-200/60 p-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                            ) : (
                                <span className="text-slate-600 font-semibold text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">FinanceTracker</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}