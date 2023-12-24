import { getTemplateFile } from '@/utils/functions/readFiles';
import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';

@Injectable()
export class TemplatesService {
  async getTemplate(
    template: string,
    replacements: Record<string, unknown>,
    compile = true,
  ) {
    const htmlText = await getTemplateFile(template);

    if (!compile) {
      return htmlText;
    }

    const context = { ...replacements };
    const hb_template = handlebars.compile(htmlText);
    const hbsToSend = hb_template(context);

    return hbsToSend;
  }
}
