import React from 'react';
import clsx from 'clsx';

const CharacterDetails = ({ character }) => {
  if (!character) return null;

  const { name, status, species, image } = character;

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 justify-center items-center self-start p-4 bg-yellow-100 w-full rounded-md xs:flex-row xs:justify-start",
        // +++ Note: focus-visible
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500",
      )}
      // +++ Note: make this <div> focusable in keyboard navigation
      tabIndex="0" 
    >
      <div role="img" aria-label={`${name}'s image`}>
        <img src={image} alt={name} className='w-full h-full max-w-48 max-h-48 xs:w-32 xs:h-32' />
      </div>

      <div className="flex py-2 px-4 w-full h-auto bg-white bg-opacity-70 flex-col gap-2 justify-around rounded-md xs:h-32">
        <h2 className="text-md text-gray-800 flex gap-1">
          Name:
          <strong>{name}</strong>
        </h2>
        <p className="text-md text-gray-800 flex gap-1">
          Status:
          <strong>{status}</strong>
        </p>
        <p className="text-md text-gray-800 flex gap-1">
          Species:
          <strong>{species}</strong>
        </p>
      </div>
    </div>
  );
};

export default CharacterDetails;
