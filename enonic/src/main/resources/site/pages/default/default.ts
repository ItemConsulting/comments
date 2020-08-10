import {ThymeleafLibrary} from "enonic-types/lib/thymeleaf";
import {pipe} from "fp-ts/lib/pipeable";
import {getContent} from "enonic-fp/lib/portal";
import { fold, map, chain } from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {Content} from "enonic-types/lib/content";
import {Region} from "enonic-types/lib/portal";
import {getRenderer} from "enonic-fp/lib/thymeleaf";

const view = resolve('./default.html');
const renderer = getRenderer<ThymeleafParams>(view)

export function get() {

    return pipe(
        getContent(),
        map(createThymeleafParams),
        chain(renderer),
        fold(
           errorResponse('default'),
           ok
        )
    )()
}

function createThymeleafParams(content: Content):ThymeleafParams {
    return {
        mainRegion: content.page.regions.main
    }
}

interface ThymeleafParams {
    mainRegion: Region
}