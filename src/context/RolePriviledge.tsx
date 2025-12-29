"use client";
import React, { createContext, useContext, useMemo } from 'react';
import { Privilege } from '@/types/types';

type PrivilegeContextType = {
  privileges: Privilege[];
};

const RolePriviledgeContext = createContext<PrivilegeContextType>({ privileges:[] });
export const usePrivilege = () => useContext(RolePriviledgeContext);

export const RolePriviledge = ({
  children,
  privileges,
}: {
  children: React.ReactNode;
  privileges: Privilege[];
}) => {
    const value = useMemo(() => ({ privileges }), [privileges]);
  return (
    <RolePriviledgeContext.Provider value={ value }>
      {children}
    </RolePriviledgeContext.Provider>
  );
};
