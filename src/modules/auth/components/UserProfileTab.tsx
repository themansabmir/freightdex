import { Typography } from '@shared/components';
import PopoverMenu from '@shared/components/Popover';
import { ChevronsUpDown, LogOut, Settings2Icon, User, UserCog } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { IUser, MenuOptions } from '../index.types';
import { useNavigate } from 'react-router-dom';

const MenuOption = ({ btnName, icon, onClick }: MenuOptions) => {
  return (
    <div className="profile__container_btn" onClick={onClick}>
      {btnName} {icon}
    </div>
  );
};
export const ProfileTabOptions = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <PopoverMenu
      trigger={
        <div>
          <UserProfileTab user={user} />
        </div>
      }
    >
      <div className="profile_container_options">
        <MenuOption
          btnName={'My Profile'}
          icon={<Settings2Icon size={18} />}
          onClick={() => {
            navigate('/my-profile');
          }}
        />
        <MenuOption
          btnName={'Team'}
          icon={<UserCog size={18} />}
          onClick={() => {
            navigate('/team');
          }}
        />
        <MenuOption btnName={'Logout'} icon={<LogOut size={18} />} onClick={() => logout()} />
      </div>
    </PopoverMenu>
  );
};
const UserProfileTab = ({ user }: { user: IUser | null }) => {
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
export default UserProfileTab;
