import React, { useState } from 'react';
import Autocomplete from './Autocomplete';
import CharacterDetails from './CharacterDetails';
import clsx from 'clsx';

import logo from "./img/rick-and-morty-logo.png"

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div className={clsx(
        "h-screen",
        // *** Note: custom background image
        "before:bg-center before:bg-cover relative before:absolute before:top-0 before:left-0 before:h-screen before:w-full before:opacity-20 before:-z-10 before:bg-[url('./img/rick-and-morty.webp')]"
      )}
    >
      <div className="flex w-full justify-center items-center h-full" >
        <div className="flex flex-col justify-center items-center p-4 gap-4 max-w-[1024px] w-full self-start">
          <div className="flex justify-center items-center px-4 w-full max-w-80 h-auto">
            <img src={logo} alt="rick and morty logo"/>
          </div>
          
          <Autocomplete onSelect={setSelectedCharacter} />

          <CharacterDetails character={selectedCharacter} />
        </div>
      </div>        
    </div>
  );
};

export default App;
