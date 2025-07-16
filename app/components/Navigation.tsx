"use client";

import { useState, useEffect } from 'react';
import { 
  Flex, 
  View,
  Heading,
  Button,
  Icon,
  useTheme,
  Text
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MdMenu, 
  MdClose, 
  MdShoppingCart, 
  MdInventory, 
  MdBarChart, 
  MdPeople, 
  MdSettings, 
  MdLock, 
  MdLogout,
  MdArrowBack
} from "react-icons/md";

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { tokens } = useTheme();

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Items', path: '/items', icon: MdInventory },
    { name: 'Cart', path: '/cart', icon: MdShoppingCart },
    { name: 'Receive Stock', path: '/receive-stock', icon: MdInventory },
    { name: 'Reports', path: '/reports', icon: MdBarChart },
    { name: 'Suppliers', path: '/suppliers', icon: MdPeople },
    { name: 'Customers', path: '/customers', icon: MdPeople },
    { name: 'Settings', path: '/settings', icon: MdSettings },
    { name: 'Change My Password', path: '/change-password', icon: MdLock },
    { name: 'Sign Out', path: '/signout', icon: MdLogout },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Flex direction="column" height="100vh">
      {/* App Bar */}
      <Flex 
        as="header" 
        backgroundColor="#1976d2" 
        color="white" 
        padding={tokens.space.xs}
        alignItems="center"
        height="60px"
      >
        {isDrawerOpen ? (
          <Button 
            aria-label="Close menu"
            onClick={toggleDrawer}
            backgroundColor="transparent"
            color="white"
            size="large"
            variation="link"
          >
            <Icon as={MdArrowBack} fontSize="1.5rem" />
          </Button>
        ) : (
          <Button 
            aria-label="Open menu"
            onClick={toggleDrawer}
            backgroundColor="transparent"
            color="white"
            size="large"
            variation="link"
          >
            <Icon as={MdMenu} fontSize="1.5rem" />
          </Button>
        )}
        
        <View as="div" width="100%" maxWidth="300px" padding={tokens.space.xs}>
          <input 
            type="text"
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
            }}
          />
        </View>
        
        <Flex gap={tokens.space.xs}>
          <Button 
            aria-label="Add item"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
          >
            <Text fontSize="1.5rem">+</Text>
          </Button>
          <Button 
            aria-label="View options"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
          >
            <Text fontSize="1.5rem">≡</Text>
          </Button>
          <Button 
            aria-label="Refresh"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
          >
            <Text fontSize="1.5rem">↻</Text>
          </Button>
          <Button 
            aria-label="Print"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
          >
            <Text fontSize="1.5rem">🖨️</Text>
          </Button>
        </Flex>
      </Flex>

      {/* Content area with optional drawer */}
      <Flex direction="row" flex="1" overflow="hidden">
        {/* Navigation Drawer and Backdrop */}
        {isDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <View
              position="fixed"
              top={0}
              left={0}
              width="100vw"
              height="100vh"
              backgroundColor="rgba(0,0,0,0.2)"
              style={{ zIndex: 9 }}
              onClick={toggleDrawer}
            />
            <Flex
              as="nav"
              direction="column"
              padding={tokens.space.medium}
              backgroundColor="#f5f5f5"
              width="100%"
              maxWidth="300px"
              position="fixed"
              height="100%"
              style={{ zIndex: 10 }}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Heading level={3} marginBottom={tokens.space.medium}>
                TPV System
              </Heading>
              <Flex direction="column" gap={tokens.space.xs}>
                {menuItems.map((item) => (
                  <Link key={item.path} href={item.path} passHref>
                    <Button
                      variation="menu"
                      backgroundColor={pathname === item.path ? "#e3f2fd" : "transparent"}
                      color="black"
                      justifyContent="flex-start"
                      width="100%"
                      padding={tokens.space.small}
                      borderRadius="0"
                      marginBottom={tokens.space.xxs}
                    >
                      <Icon as={item.icon} marginRight={tokens.space.xs} /> {item.name}
                    </Button>
                  </Link>
                ))}
              </Flex>
            </Flex>
          </>
        )}
        {/* Main Content */}
        <View as="main" flex="1" overflow="auto">
          {children}
        </View>
      </Flex>
    </Flex>
  );
}
