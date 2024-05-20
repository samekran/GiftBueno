import { SyntheticEvent, useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import Modal from 'react-modal';
import Image from 'next/image';
import { Gift } from 'types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '90%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [occasion, setOccasion] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [memory, setMemory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [recommendedGifts, setRecommendedGifts] = useState<Gift[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | undefined>(undefined);

  const openModal = (gift_name: string) => {
    const giftSelection = recommendedGifts.filter((gift: Gift) => {
      return gift.name === gift_name;
    });
    console.log(giftSelection);
    setSelectedGift(giftSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (!relationship || !occasion || !age || !hobbies || !memory || !priceRange) {
      alert("Please fill out all fields!");
      return;
    }

    setIsLoading(true);

    await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        relationship,
        occasion,
        age,
        hobbies,
        memory,
        priceRange,
      })
    })
      .then((res) => {
        console.log(res);
        if (res.ok) return res.json();
      })
      .then((recommendations) => {
        console.log(recommendations.data.Get.Gift);
        setRecommendedGifts(recommendations.data.Get.Gift);
      });

    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between">
          <h3 className="mt-2 text-lg font-semibold text-gray-700">
            {selectedGift?.name}
          </h3>
          <Button
            className="hover:font-bold rounded hover:bg-gray-700 p-2 w-20 hover:text-white "
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
        <div>
          <div className='flex justify-center py-10'>
            <div className="w-48 h-72 relative">
              <Image
                src={selectedGift?.image || ''}
                alt={"Image of the gift " + selectedGift?.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div>
            <p className="mt-1 text-gray-500"><span className="font-bold">Category</span>:{' '}{selectedGift?.category}</p>
            <p>
              <span className="font-bold">Price</span>:{' '}${selectedGift?.price}
            </p>
            <p>
              <span className="font-bold">Rating</span>:{' '}{selectedGift?.average_rating}
            </p><br />
            <p>{selectedGift?.description}</p>

            <div className="flex justify-center">
              <a
                className="hover:animate-pulse"
                target="_blank"
                href={selectedGift?.image}
              >
                <Image
                  className="w-60"
                  src="https://kentuckynerd.com/wp-content/uploads/2019/05/amazon-buy-now-button.jpg"
                  alt="Buy now button"
                  width={240}
                  height={100}
                />
              </a>
            </div>
          </div>

        </div>
      </Modal>
      <div className="mb-auto py-10 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-3xl font-black font-bold mb-6 text-center">
            Gift Recommendations
          </h1>

          <form
            id="recommendation-form"
            className="mb-10"
            onSubmit={getRecommendations}
          >
            <div className="mb-4">
              <label
                htmlFor="relationship"
                className="block text-gray-700 font-bold mb-2"
              >
                Who are you buying the gift for? (Relationship to receiver)
              </label>
              <Input
                type="text"
                id="relationship"
                name="relationship"
                placeholder="e.g., Friend, Parent, Sibling"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={relationship}
                onChange={(e) => {
                  setRelationship(e.target.value);
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="occasion"
                className="block text-gray-700 font-bold mb-2"
              >
                What is the occasion?
              </label>
              <Input
                type="text"
                id="occasion"
                name="occasion"
                placeholder="e.g., Birthday, Anniversary, Graduation"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={occasion}
                onChange={(e) => {
                  setOccasion(e.target.value);
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="age"
                className="block text-gray-700 font-bold mb-2"
              >
                How old are they?
              </label>
              <Input
                type="text"
                id="age"
                name="age"
                placeholder="e.g., 25"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="hobbies"
                className="block text-gray-700 font-bold mb-2"
              >
                What are some of their hobbies/interests?
              </label>
              <Input
                type="text"
                id="hobbies"
                name="hobbies"
                placeholder="e.g., Reading, Hiking, Cooking"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={hobbies}
                onChange={(e) => {
                  setHobbies(e.target.value);
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="memory"
                className="block text-gray-700 font-bold mb-2"
              >
                Describe a favorite memory with them
              </label>
              <Input
                type="text"
                id="memory"
                name="memory"
                placeholder="e.g., A trip to the mountains"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={memory}
                onChange={(e) => {
                  setMemory(e.target.value);
                }}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="priceRange"
                className="block text-gray-700 font-bold mb-2"
              >
                What is your price range?
              </label>
              <Input
                type="text"
                id="priceRange"
                name="priceRange"
                placeholder="e.g., $20 - $50"
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value);
                }}
              />
            </div>

            <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" disabled={isLoading} type="submit" variant="outline">
              Get Recommendations
            </Button>

          </form>

          {isLoading ? (
            <div className="w-full flex justify-center h-60 pt-10">
              <CircleLoader
                color={'#000000'}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Recommended Gifts
                  </h2>
                  <div
                    id="recommended-gifts"
                    className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended gifts dynamically added here --> */}
                    <section className="container mx-auto mb-12">
                      <div className="flex flex-wrap -mx-2">
                        {recommendedGifts.length > 0 ? (
                          recommendedGifts.map((gift: Gift) => {
                            return (
                              <div key={gift.id} className="w-full md:w-1/3 px-2 mb-4 animate-pop-in">
                                <div className="bg-white p-6 flex items-center flex-col">
                                  <div className='flex justify-between w-full'>
                                    <h3 className="text-xl font-semibold mb-4 line-clamp-1">{gift.name}</h3>
                                    {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && gift._additional.generate.error !== "connection to Cohere API failed with status: 429" && (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button className='rounded-full p-2 bg-black cursor-pointer w-10 h-10'>✨</Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80 h-80 overflow-auto">
                                            <div>
                                              <p className='text-2xl font-bold'>Why you&apos;ll like this gift:</p>
                                              <br/>
                                              <p>{gift._additional.generate.singleResult}</p>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )}
                                    
                                  </div>
                                  <div className='w-48 h-72 relative'>
                                    <Image
                                      src={gift.image}
                                      alt={"Image of the gift " + gift.name}
                                      layout="fill"
                                      objectFit="cover"
                                      className="rounded-lg shadow-lg"
                                    />
                                  </div>
                                  <p className="mt-4 text-gray-500 line-clamp-1">{gift.category}</p>
                                  <div className='flex'>
                                    <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" type="submit" variant="outline" onClick={() => { openModal(gift.name) }}>
                                      Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center w-full">No gifts found.</p>
                        )}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}

            </>
          )}
        </div>
      </div>

      <footer className="justify-center items-center bg-gray-600 text-white h-20 flex flex-col">
        <div>
        Deploy it on &nbsp;<a href="https://vercel.com/templates/next.js/weaviate-bookrecs" className="underline text-blue-200">Vercel</a> and checkout the code on <a href="https://github.com/weaviate/BookRecs/" className="underline text-blue-200">Github</a>.</div>
        <div>
        Made with ❤️ by &nbsp;<a href="https://x.com/aj__chan/" target="_blank" className="underline text-blue-200">@aj__chan</a> &nbsp; and built with &nbsp;<a target="_blank" href="https://weaviate.io/" className="underline text-blue-200">Weaviate</a>.</div>
      </footer>
    </div>
  );
}
