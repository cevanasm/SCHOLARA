import re


def normalize(value):
    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(str(x) for x in value).lower()

    return str(value).lower().strip()


def tokenize(value):
    text = normalize(value)

    return set(
        re.findall(r"[a-zA-Z0-9+#.]+", text)
    )


def skill_match(student_skills, required_skills):
    student = tokenize(student_skills)
    required = tokenize(required_skills)

    if not required:
        return 100, []

    matched = student.intersection(required)

    percentage = round(
        (len(matched) / len(required)) * 100
    )

    missing = sorted(
        required - student
    )

    return percentage, missing


def match_opportunity(student, opportunity):

    reasons = []
    gaps = []
    hard_failures = []

    # --------------------------------
    # STUDENT DETAILS
    # --------------------------------

    try:
        student_cgpa = float(
            student.get("cgpa") or 0
        )
    except (ValueError, TypeError):
        student_cgpa = 0

    # --------------------------------
    # CGPA
    # --------------------------------

    required_cgpa = opportunity.get(
        "minimum_cgpa"
    ) or 0

    try:
        required_cgpa = float(
            required_cgpa
        )
    except (ValueError, TypeError):
        required_cgpa = 0

    if required_cgpa > 0:

        if student_cgpa >= required_cgpa:

            reasons.append(
                f"Your CGPA {student_cgpa} meets "
                f"the required CGPA of {required_cgpa}."
            )

        else:

            hard_failures.append(
                f"Minimum CGPA required: "
                f"{required_cgpa}. "
                f"Your CGPA: {student_cgpa}."
            )

    # --------------------------------
    # DEGREE
    # --------------------------------

    required_degree = normalize(
        opportunity.get("required_degree")
    )

    student_degree = normalize(
        student.get("degree")
    )

    if required_degree:

        if (
            student_degree
            and (
                required_degree in student_degree
                or student_degree in required_degree
            )
        ):

            reasons.append(
                "Your degree matches the required degree."
            )

        else:

            gaps.append(
                "Required degree: "
                + str(
                    opportunity.get(
                        "required_degree"
                    )
                )
            )

    # --------------------------------
    # ACADEMIC YEAR
    # --------------------------------

    required_year = normalize(
        opportunity.get("required_year")
    )

    student_year = normalize(
        student.get("year")
    )

    if required_year:

        if student_year:

            if (
                student_year in required_year
                or required_year in student_year
            ):

                reasons.append(
                    "Your current academic year matches."
                )

            else:

                gaps.append(
                    "Preferred academic year: "
                    + str(
                        opportunity.get(
                            "required_year"
                        )
                    )
                )

    # --------------------------------
    # INCOME
    # --------------------------------

    income_limit = opportunity.get(
        "income_limit"
    )

    if income_limit is not None:

        try:

            student_income = float(
                student.get(
                    "annual_income"
                ) or 0
            )

            income_limit = float(
                income_limit
            )

            if student_income <= income_limit:

                reasons.append(
                    "Your reported annual family "
                    "income is within the limit."
                )

            else:

                hard_failures.append(
                    f"Annual family income must be "
                    f"at most ₹{income_limit:,.0f}."
                )

        except (ValueError, TypeError):

            gaps.append(
                "Annual family income needs verification."
            )

    # --------------------------------
    # SKILLS
    # --------------------------------

    skill_percentage, missing_skills = skill_match(
        student.get("skills", ""),
        opportunity.get("required_skills", "")
    )

    if skill_percentage >= 70:

        if skill_percentage == 100:

            reasons.append(
                "You have all listed required skills."
            )

        else:

            reasons.append(
                f"You match {skill_percentage}% "
                "of the listed skills."
            )

    elif skill_percentage > 0:

        gaps.append(
            f"Skill match is {skill_percentage}%. "
            f"Consider learning: "
            f"{', '.join(missing_skills)}"
        )

    elif opportunity.get("required_skills"):

        gaps.append(
            "Required skills: "
            + str(
                opportunity.get(
                    "required_skills"
                )
            )
        )

    # --------------------------------
    # LOCATION
    # --------------------------------

    location = normalize(
        opportunity.get("location")
    )

    preferred_location = normalize(
        student.get("preferred_location")
    )

    remote = bool(
        opportunity.get("remote")
    )

    if remote:

        reasons.append(
            "This opportunity supports remote participation."
        )

    elif (
        preferred_location
        and location
    ):

        if (
            preferred_location in location
            or location in preferred_location
        ):

            reasons.append(
                "The opportunity location "
                "matches your preference."
            )

    # --------------------------------
    # FINAL STATUS
    # --------------------------------

    if hard_failures:

        eligible = False
        status = "Not currently eligible"

    elif gaps:

        eligible = False
        status = "Close match"

    else:

        eligible = True
        status = "Eligible"

    # --------------------------------
    # MATCH SCORE
    # --------------------------------

    score = 0
    total = 0

    # CGPA = 30%
    if required_cgpa > 0:

        total += 30

        if student_cgpa >= required_cgpa:

            score += 30

        else:

            score += max(
                0,
                round(
                    (
                        student_cgpa
                        / required_cgpa
                    ) * 30
                )
            )

    # Degree = 20%
    if required_degree:

        total += 20

        if (
            student_degree
            and (
                required_degree in student_degree
                or student_degree in required_degree
            )
        ):

            score += 20

    # Skills = 30%
    if opportunity.get("required_skills"):

        total += 30

        score += round(
            skill_percentage * 0.30
        )

    # Income / general compatibility = 20%
    total += 20

    if (
        not hard_failures
        or not income_limit
    ):

        score += 20

    match_percentage = (
        round(
            (score / total) * 100
        )
        if total
        else 0
    )

    # --------------------------------
    # RESULT
    # --------------------------------

    return {
        "eligible": eligible,
        "status": status,
        "score": match_percentage,
        "match_percentage": match_percentage,
        "reasons": reasons,
        "gaps": gaps,
        "hard_failures": hard_failures,
        "missing_skills": missing_skills
    }