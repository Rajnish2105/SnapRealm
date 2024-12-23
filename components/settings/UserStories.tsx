import CustomLoader from '../CustomLoader';

type userStoriestype = {
  id: string;
  createdAt: Date;
  stories: string[];
};

export default function UserStories({ stories }: { stories: userStoriestype }) {
  if (!stories) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Stories</h2>
        <p className="text-muted-foreground">Manage all your account stores.</p>
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stories.stories.map((store) => {
            return (
              <div
                key={store}
                className="h-44 w-32 rounded-sm bg-cover bg-center cursor-pointer grayscale hover:grayscale-0 transition transform hover:scale-125 duration-300 ease-in-out"
                style={{ backgroundImage: `url(${store})` }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
