import {ConvertToReadableDate} from '../../../Utils/CommonUtility'

const ThesisHero = ({ payload }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold">
                {payload.title}
            </h1>
            <p className="opacity-60 mt-3 ">
                Thesis creation date: {ConvertToReadableDate(payload.createdAt)}
            </p>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2"></div>
        </div>
    )
}

export default ThesisHero