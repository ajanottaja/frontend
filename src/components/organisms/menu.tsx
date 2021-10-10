import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useState,
} from "react";
import { Link, LinkProps, useRouteMatch } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import { Disclosure } from "@headlessui/react";

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
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <Link
      to={to}
      display="flex"
      flex="row"
      w="full"
      h="10"
      justify="items-start"
      align="items-center"
      p="x-4 y-2"
      m="b-2"
      animate="hover:pulse focus:pulse"
      outline="focus:none"
      text="gray-300 no-underline focus:green-300"
      bg={match ? "dark-400" : ""}
      border={`l-2 ${match ? "green-300" : "transparent"}`}
      {...props}
    >
      <div display="flex" w="4" justify="center">
        <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      {expanded && (
        <div w="full" display="flex" flex="row" justify="start" m="l-4">
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
      display="flex"
      flex="row"
      w="full"
      h="10"
      justify="items-start"
      align="items-center"
      p="x-4 y-2"
      animate="hover:pulse focus:pulse"
      outline="focus:none"
      text="gray-300 no-underline focus:green-300"
      border="l-2 transparent"
      {...props}
    >
      <div display="flex" w="4" justify="center">
        <FontAwesomeIcon icon={expanded ? expandedIcon : icon} size="lg" />
      </div>
      {expanded && (
        <div w="full" display="flex" flex="row" justify="start" m="l-4">
          {children}
        </div>
      )}
    </button>
  );
};

export const MainMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth0();
  return (
    <nav
      h="screen"
      display="flex <sm:hidden"
      flex="col"
      justify="items-start"
      align="items-start"
      text="gray-300"
      w={expanded ? "max-full" : "min-12"}
      bg="dark-600"
      border="r-2 dark-400"
      p=""
    >
      <button
        h="4"
        m="b-4"
        p="x-2"
        w="full"
        text="right"
        animate="wobble duration-1000"
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
        onClick={() => logout()}
        icon={faSignOutAlt}
        title={!expanded ? "Sign out" : ""}
      >
        Sign out
      </MenuButton>
    </nav>
  );
};

const MobileMenuLink = ({
  children,
  icon,
  to,
  activeOnlyWhenExact = false,
  ...props
}: Omit<MenuLink, "expanded">) => {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <Disclosure.Button
      as={Link}
      to={to}
      display="flex"
      flex="row"
      w="full"
      justify="items-start"
      align="items-center"
      p="y-2"
      border="rounded"
      animate="hover:pulse focus:pulse"
      outline="focus:none"
      text="gray-300 no-underline focus:green-300"
      bg={match ? "dark-300" : ""}
      {...props}
    >
      <div w="full" display="flex" flex="row" justify="start" m="l-4">
        <span  m="r-4">
          <FontAwesomeIcon icon={icon} size="lg"/>
        </span>
        {children}
      </div>
    </Disclosure.Button>
  );
};

const MobileMenuButton = ({
  children,
  icon,
  onClick,
  ...props
}: Omit<MenuButton, "expanded">) => {
  return (
    <li>
      <button
        display="flex"
        flex="row"
        w="full"
        justify="items-start"
        align="items-center"
        p="y-2"
        border="rounded"
        animate="hover:pulse focus:pulse"
        outline="focus:none"
        text="gray-300 no-underline focus:green-300"
        onClick={onClick}
        {...props}
      >
        <div w="full" display="flex" flex="row" justify="start" m="l-4">
          <span m="r-4">
            <FontAwesomeIcon icon={icon} size="lg" />
          </span>
          {children}
        </div>
      </button>
    </li>
  );
};

const MobileMenuInner = ({auth0:{logout}}: {auth0: Auth0ContextInterface<User>}) => {
  return (
    <nav display="flex" flex="col" justify="items-center" p="4">
      <ul>
        <li display="flex" flex="row" w="full" justify="content-end" m="b-4">
          <Disclosure.Button
            text="gray-300 focus:green-300"
            focus="outline-transparent animate-pulse"
            justify="self-end"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" aria-label="Close menu" />
          </Disclosure.Button>
        </li>

        <MobileMenuLink
          to="/dashboard"
          title="Dashboard"
          icon={faTachometerAlt}
        >
          Dashboard
        </MobileMenuLink>

        <MobileMenuLink to="/calendar" title="Calendar" icon={faCalendar}>
          Calendar
        </MobileMenuLink>

        <MobileMenuLink to="/statistics" title="Statistics" icon={faChartLine}>
          Statistics
        </MobileMenuLink>

        <MobileMenuButton title="Statistics" icon={faSignOutAlt} onClick={() => logout()}>
          Sign out
        </MobileMenuButton>
      </ul>
    </nav>
  );
};

export const MobileMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const auth0 = useAuth0();
  return (
    <Disclosure
      as="div"
      pos="relative"
      w="full"
      display="hidden <sm:flex"
      justify="center"
      align="items-center"
      h="12"
      p="x-4"
      text="gray-300"
      bg="dark-500"
    >
      <Disclosure.Button
        pos="absolute inset-0 left-4"
        text="gray-300 focus:green-300"
        focus="outline-transparent animate-pulse"
        grid="col-span-0"
      >
        <FontAwesomeIcon icon={faHamburger} size="lg" />
      </Disclosure.Button>

      <h1 font="italic" className="tracking-widest" justify="self-center">
        Ajanottaja
      </h1>


      <Disclosure.Panel
        as="div"
        pos="absolute inset-0"
        z="50"
        h="screen"
        bg="dark-500"
      >
        <MobileMenuInner auth0={auth0} />
      </Disclosure.Panel>
    </Disclosure>
  );
};
