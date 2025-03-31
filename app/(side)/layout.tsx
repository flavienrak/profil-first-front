'use client';

import React from 'react';
import { Home, Inbox, LogOut, UserRound } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SideBar({ children }: { children: React.ReactNode }) {
  const items = [
    {
      title: 'Accueil',
      href: '/home',
      icon: Home,
    },
    {
      title: 'Message',
      href: '/message',
      icon: Inbox,
      badge: 12,
    },
    {
      title: 'Profil',
      href: '/profile',
      icon: UserRound,
    },
  ];
  const pathname = usePathname();

  return (
    <div className="flex">
      <div>
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Profil First</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`${
                            pathname === item.href
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                              : ''
                          }`}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="cursor-pointer text-red-400 hover:text-red-500"
                      >
                        <label>
                          <LogOut />
                          <span>Déconnexion</span>
                        </label>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
