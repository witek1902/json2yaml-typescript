export class JsonToYamlConverterService {

  public static json2yaml(json): string {
    let ret = [];
    JsonToYamlConverterService.convert(json, ret);
    return ret.join("\n");
  }

  private static getType(obj) {
    let type = typeof obj;

    if (obj instanceof Array) {
      return 'array';
    } else if (type == 'string') {
      return 'string';
    } else if (type == 'boolean') {
      return 'boolean';
    } else if (type == 'number') {
      return 'number';
    } else if (type == 'undefined' || obj === null) {
      return 'null';
    } else {
      return 'hash';
    }
  }

  private static convert(obj, ret) {
    let type = JsonToYamlConverterService.getType(obj);

    switch (type) {
      case 'array':
        JsonToYamlConverterService.convertArray(obj, ret);
        break;
      case 'hash':
        JsonToYamlConverterService.convertHash(obj, ret);
        break;
      case 'string':
        JsonToYamlConverterService.convertString(obj, ret);
        break;
      case 'null':
        ret.push('null');
        break;
      case 'number':
        ret.push(obj.toString());
        break;
      case 'boolean':
        ret.push(obj ? 'true' : 'false');
        break;
    }
  }

  private static convertArray(obj, ret) {
    if (obj.length === 0) {
      ret.push('[]');
    }
    for (let i = 0; i < obj.length; i++) {

      let ele = obj[i];
      let recurse = [];
      JsonToYamlConverterService.convert(ele, recurse);

      for (let j = 0; j < recurse.length; j++) {
        ret.push((j == 0 ? "- " : '  ') + recurse[j]);
      }
    }
  }

  private static convertHash(obj, ret) {
    for (let k in obj) {
      let recurse = [];
      if (obj.hasOwnProperty(k)) {
        let ele = obj[k];
        JsonToYamlConverterService.convert(ele, recurse);
        let type = JsonToYamlConverterService.getType(ele);
        if (type == 'string' || type == 'null' || type == 'number' || type == 'boolean') {
          ret.push(JsonToYamlConverterService.normalizeString(k) + ': ' + recurse[0]);
        } else {
          ret.push(JsonToYamlConverterService.normalizeString(k) + ': ');
          for (let i = 0; i < recurse.length; i++) {
            ret.push('  ' + recurse[i]);
          }
        }
      }
    }
  }

  private static normalizeString(str) {
    if (str.match(/^[\w]+$/)) {
      return str;
    } else {
      return '"' + encodeURI(str).replace(/%u/g, '\\u').replace(/%U/g, '\\U').replace(/%/g, '\\x') + '"';
    }
  }

  private static convertString(obj, ret) {
    ret.push(JsonToYamlConverterService.normalizeString(obj));
  }
}
