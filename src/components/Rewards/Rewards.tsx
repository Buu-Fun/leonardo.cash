import { ASSET_ADDRESS } from '@/src/config';
import { truncateAddress } from '@/src/utils/format';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

interface Props {
  totalRewards: number;
}

export const Rewards = ({ totalRewards }: Props) => {
  return (
    <div>
      {/* logo */}
      <div>
        {/* image */}
        <div></div>
        {/* dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" color="primary">
              {truncateAddress(ASSET_ADDRESS)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* values */}
      <div>
        {/* subtitle */}
        <div>Total $leonai leonardo reward</div>

        {/* value */}
        <div>{totalRewards}</div>

        {/* more values */}
        <div>
          <div>PER DAY</div>
          <div>TO THE TOP 100</div>
        </div>
      </div>
    </div>
  );
};
