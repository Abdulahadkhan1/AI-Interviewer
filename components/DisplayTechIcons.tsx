import { getTechLogos } from '@/lib/utils';
import React from 'react'
import Image from 'next/image';

const DisplayTechIcons = async ({techStack}: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);
    return (
    <div className='flex flex-row'>{techIcons.slice(0, 
        3).map(({tech, url }, index) => (
            // eslint-disable-next-line react/jsx-key
            <div className='relative group gb-dark-300
            rounded-full p-2 flex-center'>
                <span className='tech-tooltip'>{tech}</span>
                <Image src={url} alt={tech} width={100}
                height={100} className="sixe-5" />
            </div>
        ))}</div>
  )
}

export default DisplayTechIcons