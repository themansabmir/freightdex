import * as Popover from '@radix-ui/react-popover';
import { MoreVertical } from 'lucide-react'; // Optional icon, replace if needed
import { ReactNode } from 'react';

type PopoverMenuProps = {
  trigger?: ReactNode;
  children: ReactNode;
};

const PopoverMenu = ({ trigger, children }: PopoverMenuProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {trigger ?? (
          <button className="p-2 rounded hover:bg-gray-100">
            <MoreVertical size={18} />
          </button>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="rounded-lg bg-white shadow-lg p-2 w-48 border z-50" sideOffset={8}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PopoverMenu;
