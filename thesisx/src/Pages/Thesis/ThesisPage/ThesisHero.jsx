import { ConvertToReadableDate } from "../../../utils/CommonUtility";

const ThesisHero = ({ payload }) => {
    return (
        <div>
            <h1 className="sm:text-3xl text-2xl font-bold">
                {payload.title}
            </h1>
            <p className="opacity-60 mt-3 ">
                Created at: {ConvertToReadableDate(payload.createdAt)}
            </p>
        </div>
    )
}

export default ThesisHero