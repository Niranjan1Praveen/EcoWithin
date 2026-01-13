'use server'

import { currentUser } from "@clerk/nextjs/server";

const UserAvatar = async () => {
    const user = await currentUser();
    return (
        <div>
            <img
                src={user?.imageUrl || "/default-avatar.png"}
                alt="User Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
        </div>
    );
}

export default UserAvatar;
