import React, {
  DetailedHTMLProps,
  Fragment,
  HTMLAttributes,
  SelectHTMLAttributes,
  useRef,
  useState,
} from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { IntervalEditor } from "../organisms/interval-editor";
import { useAuth0 } from "@auth0/auth0-react";
import { TargetEditor } from "../organisms/target-editor";

const CreateMenu = () => {
  const auth0 = useAuth0();
  const [isEditingInterval, setIsEditingInterval] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  return (
    <div>
      <IntervalEditor
        auth0={auth0}
        isOpen={isEditingInterval}
        close={() => setIsEditingInterval(false)}
      />

      <TargetEditor
        auth0={auth0}
        isOpen={isEditingTarget}
        close={() => setIsEditingTarget(false)}
      />

      <Menu as="div" pos="relative" m="4">
        {({ open }) => (
          <>
            <Menu.Button
              as="button"
              display="flex"
              bg="green-900 focus:green-600 hover:green-600"
              border="1 rounded-full dark-50"
              outline="focus:transparent"
              shadow="~"
              p="6"
              w="full"
              text="gray-300"
              transition="colors"
              animate="focus:pulse"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                display="grid"
                gap="y-4"
                w="32"
                pos="absolute bottom-20 right-0 z-100"
                shadow="~"
                text="gray-300"
              >
                <Menu.Item as="li">
                  {({ active }) => (
                    <button
                      p="4"
                      border={`rounded 1 ${
                        active ? "green-300" : "transparent"
                      }`}
                      bg="dark-400"
                      onClick={() => setIsEditingTarget(true)}
                    >
                      Add target
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item as="li">
                  {({ active }) => (
                    <button
                      p="4"
                      border={`rounded 1 ${
                        active ? "green-300" : "transparent"
                      }`}
                      bg="dark-400"
                      onClick={() => setIsEditingInterval(true)}
                    >
                      Add interval
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default CreateMenu;
