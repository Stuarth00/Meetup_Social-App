import image_default from "../../assets/image_default.svg.png";

interface AvatarProps {
  type: "avatar";
  avatar: string;
  onClose: () => void;
}

function Avatar({ avatar }: AvatarProps) {
  return (
    <div className="flex justify-center items-center p-4">
      <img
        src={avatar || image_default}
        alt={`${"User"}'s profile picture`}
        className="h-64 w-64 rounded-full object-cover"
        loading="eager"
      />
    </div>
  );
}
export default Avatar;
