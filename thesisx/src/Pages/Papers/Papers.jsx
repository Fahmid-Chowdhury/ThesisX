import { PaperProvider } from "../../Contexts/PaperContext/PaperContext"
import SearchBarWithFilters from './SearchBarWithFilters';
import PaperList from "./PaperList";

const Papers = () => {
    return (
        <PaperProvider>
            <div className="relative">
                <SearchBarWithFilters />
                <PaperList />
            </div>
        </PaperProvider>
    )
}

export default Papers