/**
 * Created by .
 * User: luispallareslopez
 * Date: 16/09/11
 * To change this template use File | Settings | File Templates.
 */

exports.trim = trim;
function trim(string) {
    return string.replace(/^\s+/g,'').replace(/\s+$/g,'');
}