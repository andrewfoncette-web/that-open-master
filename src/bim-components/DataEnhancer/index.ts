import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments"; 
import { DataEnchancerSource } from "./src";

export class DataEnhancer extends OBC.Component {
    static uuid = "52bc9eff-5c4b-454a-a789-65e8901528c3" as const
    enabled = true;

    private _sourcesDataCache: Record<string, any[]> = {}

    readonly sources = new FRAGS.DataMap<string, DataEnchancerSource>()

    async getSourceData(source: string) {
        const sourceConfig = this.sources.get(source)
        if (!sourceConfig) {
            throw new Error(`DataEnhancer: Source "${source}" not found`)
        }

        let data = this._sourcesDataCache[source]
        if (!data) {
            data = await sourceConfig.data()
            this._sourcesDataCache[source] = data 
        }

        return data
    }

    async getData(items: OBC.ModelIdMap) {
        const fragments = this.components.get(OBC.FragmentsManager)
        const result: OBC.ModelIdDataMap<Record<string, any[]>> = new FRAGS.DataMap()
        for (const [modelId, _localIds] of Object.entries(items)) {
            const model = fragments.list.get(modelId)
            if (!model) continue
            const localIds = [..._localIds]
            const itemsData = await model.getItemsData(localIds)
            for (const [source, config] of this.sources.entries()) {
                const sourceData = await this.getSourceData(source)
                for (const [index, attributes] of itemsData.entries()) {

                    const itemExternalData = config.matcher(attributes, sourceData)
                    if (!itemExternalData) continue

                    let modelResult = result.get(modelId)
                    if (!modelResult) {
                        modelResult = new FRAGS.DataMap()
                        result.set(modelId, modelResult)
                    }

                    const localId = localIds[index]
                    let itemSources = modelResult.get(localId)
                    if (!itemSources) {
                        itemSources = {}
                        modelResult.set(localId, itemSources)
                    }

                    itemSources[source] = itemExternalData

                }  
            }
        }

        return result
    }
}