export const getThemes = (req, res) => {
    try{
        res.json({Themes: [{value: 'Books', label: 'Books'}, {value: 'Signs', label: 'Signs'},
                {value: 'Silverware', label: 'Silverware'}, {value: 'Coins', label: 'Coins'}]})
    } catch (e) {
        res.json({message: "Server error"})
    }
}