import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useState,
  Fragment,
} from "react";
import { Link, LinkProps, useMatch, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendar,
  faChartLine,
  faHamburger,
  faSignOutAlt,
  faTachometerAlt,
  faTimes,
  IconDefinition,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useClient } from "../../supabase/use-client";
import { useAuth } from "../../supabase/auth-provider";

type MenuLink = Omit<LinkProps, "icon"> & {
  icon: IconDefinition;
  to: string;
  activeOnlyWhenExact?: boolean;
  expanded: boolean;
};

const MenuLink = ({
  children,
  icon,
  to,
  activeOnlyWhenExact = false,
  expanded,
  ...props
}: MenuLink) => {
  const match = useMatch({
    path: to,
    end: activeOnlyWhenExact,
  });

  return (
    <Link
      to={to}
      className={`flex flex-row w-full h-10 justify-start items-center px-4 py-2 mb-2 hover:animate-pulse focus:animate-pulse focus:outline-none text-gray-300 no-underline focus:text-green-300 ${
        match ? 'bg-stone-400' : ''
      } border-l-2 ${match ? 'border-green-300' : 'border-transparent'}`}
      {...props}
    >
      <div className="flex w-4 justify-center">
        <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      {expanded && (
        <div className="w-full flex flex-row justify-start ml-4">
          {children}
        </div>
      )}
    </Link>
  );
};

type MenuButton = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "icon"
> & {
  icon: IconDefinition;
  expandedIcon?: IconDefinition;
  expanded: boolean;
};

const MenuButton = ({
  children,
  icon,
  expandedIcon = icon,
  expanded,
  onClick,
  ...props
}: MenuButton) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row w-full h-10 justify-start items-center px-4 py-2 hover:animate-pulse focus:animate-pulse focus:outline-none text-gray-300 no-underline focus:text-green-300 border-l-2 border-transparent"
      {...props}
    >
      <div className="flex w-4 justify-center">
        <FontAwesomeIcon icon={expanded ? expandedIcon : icon} size="lg" />
      </div>
      {expanded && (
        <div className="w-full flex flex-row justify-start ml-4">
          {children}
        </div>
      )}
    </button>
  );
};

export const MainMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const client = useClient();
  return (
    <nav className={`h-screen sm:flex hidden flex-col justify-start items-start text-gray-300 ${
      expanded ? 'max-w-full' : 'min-w-12'
    } bg-stone-600 border-r-2 border-dark-400`}>
      <button
        className="h-4 mb-4 px-2 w-full text-right animate-wobble duration-1000"
        onClick={() => setExpanded(!expanded)}
      >
        <FontAwesomeIcon icon={expanded ? faTimes : faArrowRight} size="xs" />
      </button>

      <MenuLink
        to="/dashboard"
        title={!expanded ? "Dashboard" : ""}
        icon={faTachometerAlt}
        expanded={expanded}
      >
        Dashboard
      </MenuLink>

      <MenuLink
        to="/calendar"
        title={!expanded ? "Calendar" : ""}
        icon={faCalendar}
        expanded={expanded}
      >
        Calendar
      </MenuLink>

      <MenuLink
        to="/statistics"
        title={!expanded ? "Statistics" : ""}
        icon={faChartLine}
        expanded={expanded}
      >
        Statistics
      </MenuLink>

      <MenuButton
        expanded={expanded}
        onClick={() => client.auth.signOut()}
        icon={faSignOutAlt}
        title={!expanded ? "Sign out" : ""}
      >
        Sign out
      </MenuButton>
    </nav>
  );
};

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const client = useClient();
  const { user } = useAuth();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-stone-800/50 focus:outline-none"
      >
        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-end">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <DialogPanel className="w-full max-w-sm transform overflow-hidden bg-stone-900/75 p-6 text-left align-middle shadow-xl transition-all h-screen">
                  <div className="flex items-center justify-between mb-4 border-b border-stone-700 pb-4">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                      Menu
                    </DialogTitle>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-300 hover:text-green-400 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-stone-700 text-green-400'
                            : 'text-gray-300 hover:bg-stone-700 hover:text-green-400'
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/calendar"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-stone-700 text-green-400'
                            : 'text-gray-300 hover:bg-stone-700 hover:text-green-400'
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faCalendar} className="mr-3" />
                      Calendar
                    </NavLink>
                    <NavLink
                      to="/statistics"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-stone-700 text-green-400'
                            : 'text-gray-300 hover:bg-stone-700 hover:text-green-400'
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faChartLine} className="mr-3" />
                      Statistics
                    </NavLink>
                  </div>

                  <div className="mt-8 border-t border-stone-700 pt-4">
                    <div className="px-3 py-2 text-sm text-gray-400 mb-2">
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {
                        client.auth.signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-stone-700 hover:text-green-400 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
