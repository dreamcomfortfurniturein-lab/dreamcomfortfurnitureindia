export default function SocialLinks() {
  const links = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61580597526882",
      icon: "https://cdn.simpleicons.org/facebook/2B1D14",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/dreamcomfortfurniture.in/?hl=en",
      icon: "https://cdn.simpleicons.org/instagram/2B1D14",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@dreamcomfortfurnitureIndia",
      icon: "https://cdn.simpleicons.org/youtube/2B1D14",
    },
    {
      name: "Google Maps",
      href: "https://www.google.com/maps/place/DreamComfortFurniture/@17.7276761,83.2930862,17z/data=!3m1!4b1!4m6!3m5!1s0x3a394326bc075d5b:0x3ef3ea937dd355e2!8m2!3d17.7276761!4d83.2956611!16s%2Fg%2F11nr5j0bsz?authuser=0&entry=ttu",
      icon: "https://cdn.simpleicons.org/googlemaps/2B1D14",
    },
    {
      name: "Email",
      href: "mailto:dreamcomfortfurniture.in@gmail.com",
      icon: "https://cdn.simpleicons.org/gmail/2B1D14",
    },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {links.map((link) => {
        return (
        <a  
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="opacity-70 hover:opacity-100 transition-opacity"
         >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.icon} alt={link.name} className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        );
      })}
    </div>
  );
}