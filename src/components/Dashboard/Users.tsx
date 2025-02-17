import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const Users = ({
  users,
  setSelectedUser,
  setIsModalOpen2,
  handleCloneUser,
  setIsModalOpen3,
}: any) => {
  return (
    <div>
      <div className="grid grid-cols-8 items-center border-b px-5 border-b-grey100 text-grey300 text-[16px] font-[400]">
        <p className="col-span-2 px-3 py-2">User details</p>
        <p className="px-3 py-2">Role</p>
        <p className="col-span-2 px-3 py-2">Employee ID</p>
        <p className="px-3 py-2">Mobile No</p>
        <p className="col-span-2 px-3 py-2"></p>
      </div>
      <div className=" grid mt-[16px] gap-[8px]">
        {users.length === 0 ? (
          <p className="text-center text-grey500">No users available.</p>
        ) : (
          users.map((user: any) => (
            <div
              key={user.id}
              className="grid grid-cols-8 items-center px-5 py-2 font-[400] bg-[#F8F8F8] text-[16px] text-grey500"
            >
              <div className="col-span-2 px-3 py-2 flex items-center gap-[16px] overflow-visible whitespace-normal">
                <div>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <PersonIcon />
                  </Avatar>
                </div>
                <div>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="font-medium text-[14px]">{user.personal_email}</p>
                </div>
              </div>
              <p className="px-3 py-2">{user.user_role}</p>
              <p className="col-span-2 px-3 py-2">{user._id}</p>
              <p className="px-3 py-2">{user.phone_number}</p>
              <div className="px-3 py-2 flex items-center col-span-2 justify-end">
                <div className="text-[14px] flex gap-2 items-center border-2 rounded-md border-grey200">
                  <button
                    onClick={() => {
                      setIsModalOpen3(true);
                      setSelectedUser(user);
                    }}
                    className="px-3 py-2 text-purple500 border-r-2 border-grey200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleCloneUser(user);
                    }}
                    className="px-3 py-2 text-purple500"
                  >
                    Clone
                  </button>
                  <button
                    className="px-3 py-2 border-l-2 border-grey200 text-[#B61C1C]"
                    onClick={() => {
                      setIsModalOpen2(true);
                      setSelectedUser(user);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
