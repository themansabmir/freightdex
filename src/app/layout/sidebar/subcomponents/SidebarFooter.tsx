import { useAuth } from '@modules/auth/hooks/useAuth';
import { Typography } from '@shared/components';
import PopoverMenu from '@shared/components/Popover';
import { ChevronsUpDown, LogOut, Settings2Icon, User } from 'lucide-react';
import React from 'react';

const UserProfileTab = ({ user }) => {
  return (
    <div className="profile__container">
      <div className="flex gap-1 items-center">
        <div className="profile_avatar">
          <User />
        </div>
        <div>
          <Typography variant="lg" weight="regular" addClass="profile_title">
            {user?.first_name}
          </Typography>
          <Typography addClass="profile_subtitle">{user?.role}</Typography>
        </div>
      </div>
      <ChevronsUpDown />
    </div>
  );
};
const Footer: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="">
      <PopoverMenu
        trigger={
          <div>
            <UserProfileTab user={user} />
          </div>
        }
      >
        <div className="profile_container_options">
          <div className="profile__container_btn">
            My Profile <Settings2Icon size={18} />
          </div>
          <div className="profile__container_btn" onClick={() => logout()}>
            Logout
            <LogOut size={18} />
          </div>
        </div>
      </PopoverMenu>
    </div>
  );
};

export default Footer;
