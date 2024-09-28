import React from 'react'
import { Card } from 'flowbite-react'

function CardComponent(props) {
    return (
        <div className='min-h-[50vh] flex justify-end items-stretch'>
            <Card
                className="object-cover w-[30vw] min-h-[50vh]"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={props.img}
            >
                <div></div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {props.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                    Read More
                </p>
            </Card>
        </div>
    )
}

export default CardComponent
