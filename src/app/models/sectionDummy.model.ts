import { Lecture } from './lecture.model';

export class SectionDummy {
  constructor(
    public section_id: string,
    public section_title: string,
    public lecture: Lecture[]
  ) {}
}
